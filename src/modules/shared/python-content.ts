export const associationRulesScript = (repoData, taskData, logComment) => {
    return `
import resource
import platform
import sys

import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import association_rules, fpgrowth, apriori
import clickhouse_connect

import psutil
import functools

def memory_limit(limit=0.8):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            process = psutil.Process()
            start_mem = process.memory_info().rss
            func(*args, **kwargs)
            end_mem = process.memory_info().rss
            mem_usage = end_mem - start_mem
            if mem_usage > limit * psutil.virtual_memory().total:
                raise MemoryError(f"MemoryError: Memory usage exceeded {limit*100:.2f}%")
        return wrapper
    return decorator

@memory_limit()
def main():
    g_host="${repoData.host}"
    g_username="${repoData.user}"
    g_password="${repoData.password}"
    g_port=${repoData.port || '8123'}
    g_database="bucket_${taskData.appId}"
    g_table_name="${taskData.tableName}"
    g_result_name="${taskData.resultTable}"
    g_transaction="${taskData.columnCategory}"
    g_item="${taskData.columnReference}"
    g_support=${taskData.minSupport}
    g_min_threshold=${taskData.minThreshold}
    g_association_type="${taskData.associationType || ''}"
    
    if g_association_type == 'apriori':
        g_association_type = apriori
    else:
        g_association_type = fpgrowth
        
    db = clickhouse_connect.get_client(
        host=g_host,
        username=g_username,
        password=g_password,
        port=g_port,
        database=g_database,
        ${logComment}
    )

    def extract_values(obj):
        values = []
        for value in obj:
            values.append(str(value))
        return ', '.join(values)

    df = db.query_df(f"select * from {g_table_name} where {g_transaction} is not null and {g_item} is not null")
    id_transaction = g_transaction
    id_item = g_item
    type_association_rules = g_association_type

    transactions = df.groupby(id_transaction)[id_item].apply(list).values.tolist()

    te = TransactionEncoder()
    te_ary = te.fit_transform(transactions)
    encoded_df = pd.DataFrame(te_ary, columns=te.columns_)

    frequent_itemsets = type_association_rules(
        encoded_df, min_support=g_support, use_colnames=True
    )
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=g_min_threshold)
    rules = rules.rename(columns=lambda x: x.replace(" ", "_"))
    rules[['antecedents', 'consequents']] = rules[['antecedents', 'consequents']].applymap(lambda x: extract_values(x))


    def map_data_type(dtype):
        # Map the Pandas data type to ClickHouse type
        type_mapping = {
            "Int64": "Nullable(Int64)",
            "float64": "Nullable(Float64)",
        }
        clickhouse_type = type_mapping.get(str(dtype))
        return clickhouse_type if clickhouse_type else "Nullable(String)"


    column_names = rules.columns.tolist()
    column_types = rules.dtypes.map(map_data_type).tolist()

    # Dropando tabela se ela já existir
    table_name = g_result_name
    drop_table_query = f"DROP TABLE IF EXISTS {table_name}"
    db.command(drop_table_query)

    # Criando tabela que vai receber o insert
    create_table_query = f"CREATE TABLE {table_name} ("
    column_definitions = [
        f"{name} {ctype}" for name, ctype in zip(column_names, column_types)
    ]
    create_table_query += ", ".join(column_definitions)
    create_table_query += ") ENGINE = MergeTree() ORDER BY tuple();"
    db.command(create_table_query)

    rules_str = rules.astype(str)
    db.insert_df(table_name, rules_str)
    
main()
`
}
