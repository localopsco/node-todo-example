# Define variables
# make sure to install jq package before running this via
# brew install jq
PACKAGE_JSON=package.json
DOCKER_REGISTRY=public.ecr.aws/r5p6q2u1
AWS_REGION=us-east-1

# Extract version from package.json
VERSION=$(shell jq -r '.version' $(PACKAGE_JSON))
IMAGE_NAME=$(shell jq -r '.name' $(PACKAGE_JSON))

# Default target
all: build push

login:
	@echo "Loggin into AWS account"
	aws ecr-public get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin public.ecr.aws

# Build Docker image
build:
		@echo "Building Docker image with tag $(VERSION)..."
		docker build --platform linux/amd64 -t $(IMAGE_NAME) .

# Push Docker image
push:
		@echo "Pushing Docker image to registry..."
		docker tag $(IMAGE_NAME):latest $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest
		docker tag $(IMAGE_NAME):latest $(DOCKER_REGISTRY)/$(IMAGE_NAME):v$(VERSION)
		docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest
		docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):v$(VERSION)

# Clean up
clean:
		@echo "Cleaning up Docker images..."
		docker rmi $(IMAGE_NAME):$(VERSION)
		docker rmi $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION)

push-helm:
		helm package helm -d helm/.tmp/
		helm push helm/.tmp/${IMAGE_NAME}-helm-${VERSION}.tgz oci://${DOCKER_REGISTRY}/
		helm registry logout public.ecr.aws
