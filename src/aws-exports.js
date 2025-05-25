const awsmobile = {
  aws_project_region: 'us-east-2',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_73Cr7uTre',
  aws_user_pools_web_client_id: '6b0lule1v5ha6eb3a1pu9b370c',
  oauth: {},
  Auth: {
    mandatorySignIn: false,
    userAttributes: [
      { Name: 'email', Required: true },
      { Name: 'custom:email_updates', Required: false }
    ]
  }
};
export default awsmobile;