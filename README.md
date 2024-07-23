# TodoApp

A Sample Todo app for deliver built on nodejs using Express(Backend) + Vite(React Frontend)+ Postgres

### Environment Variables

Copy the `.env.sample` and create a `.env` file and set the required values

### Dev Server

To start the development server:

```bash
docker compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building and pushing image tags

To build docker images

```bash
make build
```

To push docker images

```bash
make push
```

To push helm chart

```bash
make push-helm-app version=0.0.2
```

before doing this make sure to update version in `helm/Chart.yaml`. Also maintain appVersion same as in docker image version

### Running using minikube

Start minikube

```bash
minikube start
```

Install the required helm dependencies

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm dependency update
```

If you are enabling s3 support, which is disabled by default, Convert your AccessKey and SecretAccessKey to base64 encode string

```bash
echo -n 'AwsAccessKeyId' | base64
echo -n 'AwsSecretAccessKey' | base64
```

and replace them in [helm/secret.yaml](./helm/secret.yaml) and run

```bash
kubectl apply -f helm/secret.yaml
```

> [!NOTE]
> You don't need to apply secrets while deploying via LocalOps

Install the helm chart

```bash
# For local all
helm install todo-app ./helm --set gateway.service.type=LoadBalancer
# For installing from ECR
helm install todo-app oci://public.ecr.aws/r5p6q2u1/node-todo-example-helm --version={VERSION}
```

before installing next version, uninstall existing chart

```bash
helm uninstall todo-app
```

Run tunnel to access the client

```bash
minikube tunnel
```

### Values to use while installing in LocalOps

See [example-values.yaml](./example-values.yaml) for the values
