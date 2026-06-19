# Terraform skeleton for Verand Store infrastructure.
# Fill in a real provider (AWS/GCP/DigitalOcean) before applying.

terraform {
  required_version = ">= 1.5"
  # required_providers {
  #   aws = { source = "hashicorp/aws", version = "~> 5.0" }
  # }
}

variable "project" {
  type    = string
  default = "verand-store"
}

variable "region" {
  type    = string
  default = "ap-southeast-1"
}

variable "environment" {
  type    = string
  default = "production"
}

# Example placeholders — replace with real resources:
# - managed MySQL (e.g. RDS / Cloud SQL)
# - container service / k8s cluster
# - object storage for screenshots
# - managed Kafka (e.g. MSK)

output "notes" {
  value = "Define provider + resources for ${var.project} (${var.environment}) in ${var.region}."
}
