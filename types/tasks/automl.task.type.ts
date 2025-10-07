import { type CommonTaskType } from './common.task.type'

export type AutoMLTaskTypeSettings = Partial<{
	seed: number
	maxModels: number
	projectId: string
	splitFrame: number
	projectName: string
	reloadSource: boolean
	removeColumns: Array<string>
	trainingFrame: string
	maxRuntimeSecs: number
	responseColumn: string
	limitRows: number
	metadataTableResults: boolean
}>

export type AutoMLTaskType = Partial<{
	type: 'automl'
	settings: AutoMLTaskTypeSettings
	limitRows: number
}> &
	CommonTaskType

// TYPES
interface H2OMetaSchema {
	schema_version: number
	schema_name: string
	schema_type: string
}

interface H2OKey {
	__meta: H2OMetaSchema
	name: string
	type: string
	URL: string
}

interface ColumnSpec {
	__meta: H2OMetaSchema
	name: string
	type: string
	format: string
	description: string
}

export interface TwoDimTable {
	__meta: H2OMetaSchema
	name: string
	description: string
	columns: ColumnSpec[]
	rowcount: number
	data: (string | number | boolean | null)[][]
}

export interface ConfusionMatrix {
	__meta: H2OMetaSchema
	table: TwoDimTable
}

interface ModelMetrics {
	__meta: H2OMetaSchema
	model: H2OKey
	model_checksum: number
	frame: H2OKey | null
	frame_checksum: number
	description: string | null
	model_category: string
	scoring_time: number
	predictions: H2OKey | null
	MSE: number
	RMSE: number
	nobs: number
	custom_metric_name: string | null
	custom_metric_value: number
	r2: number
	logloss: number
	loglikelihood: string | number
	AIC: string | number
	AUC: number
	pr_auc: number
	Gini: number
	mean_per_class_error: number
	domain: string[]
	cm: ConfusionMatrix
	thresholds_and_metric_scores: TwoDimTable
	max_criteria_and_metric_scores?: TwoDimTable
	gains_lift_table?: TwoDimTable
}

interface ModelOutput {
	__meta: H2OMetaSchema
	names: string[]
	original_names: string[] | null
	column_types: string[]
	domains: (string[] | null)[]
	cross_validation_models: H2OKey[] | null
	cross_validation_predictions: H2OKey[]
	cross_validation_holdout_predictions_frame_id: H2OKey | null
	cross_validation_fold_assignment_frame_id: H2OKey | null
	model_category: string
	model_summary: TwoDimTable
	scoring_history: TwoDimTable
	cv_scoring_history: TwoDimTable[]
	reproducibility_information_table: TwoDimTable[]
	training_metrics: ModelMetrics
	validation_metrics?: ModelMetrics
	cross_validation_metrics?: ModelMetrics
	cross_validation_metrics_summary?: TwoDimTable
	status: string | null
	start_time: number
	end_time: number
	run_time: number
	default_threshold: number
	help?: Record<string, string>
	variable_importances?: TwoDimTable
	variable_importances_frequency: TwoDimTable
	variable_importances_cover?: TwoDimTable
	init_f?: number
}

export type AutoMLOutput = {
	/** Algorithm name used for the model */
	algo: string

	/** Model key reference */
	model: H2OKey

	/** Model output containing all training results and metrics */
	output: ModelOutput

	/** Response column name */
	response: string

	/** AutoML leaderboard summary table */
	summary: TwoDimTable

	/** Additional model parameters (optional) */
	parameters?: Record<string, unknown>

	/** Model performance metrics (optional) */
	metrics?: {
		training?: ModelMetrics
		validation?: ModelMetrics
		cross_validation?: ModelMetrics
	}

	/** Feature importance information (optional) */
	feature_importance?: TwoDimTable

	/** Model explanation data (optional) */
	explanations?: {
		residual_analysis?: TwoDimTable
		learning_curve?: TwoDimTable
		prediction_explanations?: TwoDimTable
	}

	/** Cross-validation fold information (optional) */
	cross_validation?: {
		fold_assignment?: H2OKey
		holdout_predictions?: H2OKey
		models?: H2OKey[]
	}

	/** Model deployment information (optional) */
	deployment?: {
		mojo_path?: string
		pojo_path?: string
		model_artifacts?: string[]
	}

	/** Training configuration (optional) */
	training_config?: {
		max_runtime_seconds?: number
		max_models?: number
		seed?: number
		nfolds?: number
		balance_classes?: boolean
		class_sampling_factors?: number[]
		max_after_balance_size?: number
		stopping_metric?: string
		stopping_tolerance?: number
		stopping_rounds?: number
		sort_metric?: string
	}

	/** Additional metadata (optional) */
	metadata?: {
		project_name?: string
		timestamp?: number
		h2o_version?: string
		user?: string
		dataset_info?: {
			name?: string
			rows?: number
			columns?: number
			target_column?: string
		}
	}
}
