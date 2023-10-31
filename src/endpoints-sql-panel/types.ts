export enum ClientSafeErrorMessage {
  MISSING_SQL = 'Missing SQL query, please add one in the field options',
  MISSING_IS_USING_ENTITY_ID = "A '$entityId' was found in the SQL query but the 'is_using_entity_id' option is not enabled, did you forget to enable it?",
  MISSING_CURRENT_ENTITY_ID = "Can't retrieve current entity id",
  MISSING_FIELD_ID = 'Missing field id',
}
