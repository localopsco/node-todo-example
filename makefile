ECR_REPO = public.ecr.aws/r5p6q2u1
APP_NAME = node-sample-app

ifneq ($(NODE_ENV), development)
	$(info Running makefile in production mode)
	export DOCKER_DEFAULT_PLATFORM=linux/amd64
endif

push-app:
	docker compose build
	aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REPO}

	for tag in latest ${version}; do \
		docker tag ${APP_NAME}-worker:latest ${ECR_REPO}/${APP_NAME}-worker:$$tag; \
		docker tag ${APP_NAME}-client:latest ${ECR_REPO}/${APP_NAME}-client:$$tag; \
		docker tag ${APP_NAME}-backend:latest ${ECR_REPO}/${APP_NAME}-backend:$$tag; \
		docker push ${ECR_REPO}/${APP_NAME}-worker:$$tag; \
		docker push ${ECR_REPO}/${APP_NAME}-client:$$tag; \
		docker push ${ECR_REPO}/${APP_NAME}-backend:$$tag; \
	done

push-helm-app:
	helm package helm -d helm/.tmp/
	aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REPO}
	helm push helm/.tmp/${APP_NAME}-helm-${version}.tgz oci://${ECR_REPO}/
	helm registry logout public.ecr.aws
