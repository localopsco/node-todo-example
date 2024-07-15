# TodoApp

A Sample Todo app for deliver built on nodejs using Express(Backend) + Vite(React Frontend)+ Postgres

# Environment Variables

Copy the `.env.sample` and create a `.env` file and set the required values

## Dev Server

To start the development server:

```bash
docker compose up
```

You need to uncomment the volumes in compose.yml to enable hot reload. Make sure not to commit the volumes

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Building and pushing image tags

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

# Running using minikube

Start minikube

```bash
minikube start
```

Install the helm chart

```bash
helm install node-sample-app oci://public.ecr.aws/r5p6q2u1/node-todo-example-helm --version={VERSION}
```

before installing next version, uninstall existing chart

```bash
helm uninstall node-sample-app
```

Run tunnel to access the client

```bash
minikube tunnel
```
