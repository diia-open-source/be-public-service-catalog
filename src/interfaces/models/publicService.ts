import { Document } from 'mongoose'

import { PublicService } from '@src/generated'

export interface PublicServiceModel extends PublicService, Document {}
