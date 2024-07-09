import { Document } from '@diia-inhouse/db'

import { PublicService } from '@src/generated'

export interface PublicServiceModel extends PublicService, Document {}
