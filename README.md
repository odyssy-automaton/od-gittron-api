# od-gittron-api

<table border="0"><tr>  <td><a href="https://gittron.me/bots/0xcbdf824467c0dcc859e7a23a65f79774"><img src="https://s3.amazonaws.com/od-flat-svg/0xcbdf824467c0dcc859e7a23a65f79774.png" alt="gittron" width="50"/></a></td><td><a href="https://gittron.me/bots/0xcbdf824467c0dcc859e7a23a65f79774">SUPPORT US WITH GITTRON</a></td></tr></table>

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
