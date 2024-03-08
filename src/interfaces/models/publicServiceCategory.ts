import { Document } from 'mongoose'

import { PublicServiceCategory } from '@src/generated'

export interface PublicServiceCategoryModel extends PublicServiceCategory, Document {}
