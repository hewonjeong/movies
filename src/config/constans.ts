const { AWS_REGION: region, DATABASE_ENDPOINT: endpoint } = process.env
export const aws = { region, endpoint }
