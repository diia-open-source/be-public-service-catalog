import { ObjectId } from 'bson'

import PublicServiceDataMapper from '@dataMappers/publicServiceDataMapper'

import { publicService } from '@tests/mocks/publicServices'

describe('DataMapper PublicServiceDataMapper', () => {
    const publicServiceDataMapper = new PublicServiceDataMapper()

    it('should transform PublicService model to PublicServiceResult', () => {
        const id = new ObjectId()

        expect(
            publicServiceDataMapper.toEntity({
                ...publicService,
                _id: id,
            }),
        ).toEqual({
            ...publicService,
            id: id.toString(),
        })
    })
})
