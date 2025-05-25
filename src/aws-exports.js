const awsmobile = {
  aws_project_region: 'us-east-2',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_73Cr7uTre',
  aws_user_pools_web_client_id: '5t0bf9mkeh7mc9f3smp1blv5l0',
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