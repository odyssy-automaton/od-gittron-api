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
serverless deploy --stage dev
serverless deploy --stage prod
```

#### TODO:

Need to test deployment with another machine. Not sure yet if we need to share credentials or the .serverless/serverless-state.json so they existing AWS elements are updated and new ones are not created.

## API Ref

### /create

body

```json
{
  "repo": "ethereum-go",
  "repoOwner": "ethereum",
  "tokenType": "base"
}
```
