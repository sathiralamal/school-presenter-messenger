// Master environment
const awsmobile:any = {
    "aws_project_region": "eu-central-1",
    "version": "2.2.1",
    "env": "master",
    "aws_cognito_identity_pool_id": "eu-central-1:ace3cd49-8ccc-4523-9cac-51b3afb0eb30",
    "aws_cognito_region": "eu-central-1",
    "aws_user_pools_id": "eu-central-1_rZoG0LAB4",
    "aws_user_pools_web_client_id": "6kfkojf4q03h7rtfea7pot549u",
    "oauth": {},
    "aws_cognito_username_attributes": [
        "EMAIL",
        "PHONE_NUMBER"
    ],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "PHONE_NUMBER"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "PHONE_NUMBER, EMAIL"
    ],
    API: {
        endpoints: [
            {
                name: "platformapi",
                endpoint: "https://r9drhgcno4.execute-api.af-south-1.amazonaws.com/master",
                region:"af-south-1"
            }]},
    // "aws_appsync_graphqlEndpoint": "https://4c2gj6tkbzbsramffwkb6im7ru.appsync-api.eu-central-1.amazonaws.com/graphql",
    // "aws_appsync_region": "eu-central-1",
    // "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_user_files_s3_bucket": "scholarpresent-doc-master",
    "aws_user_files_s3_bucket_region": "af-south-1",
    "aws_mobile_analytics_app_id": "edd1ffe4009f49b6ad9bbc2d6b203ca4",
    "aws_mobile_analytics_app_region": "eu-central-1"
};
export default awsmobile;
