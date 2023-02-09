import { AddFeatureDto } from '../api/configuration/feature/dto/add-feature.dto';

export const featureFlagsConfig: AddFeatureDto[] = [
  {
    name: 'ProfilePage',
    description: 'Access to profile page',
    isActive: true,
  },
  {
    name: 'CompanyPage',
    description: 'Access to company page',
    isActive: true,
  },
];
