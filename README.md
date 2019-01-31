# od-gittron-api

### Deploy

AWS credentials are needed at ~.aws/credentials

```bash
serverless deploy
```

Single function

```bash
serverless deploy function --function myFunction
```

Production deploy

```bash
serverless deploy --stage production --region us-east-1
```

#### TODO:

Need to test deployment with another machine. Not sure yet if we need to share credentials or the .serverless/serverless-state.json so they existing AWS elements are updated and new ones are not created.
