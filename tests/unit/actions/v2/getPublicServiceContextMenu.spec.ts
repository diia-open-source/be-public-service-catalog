import TestKit, { mockInstance } from '@diia-inhouse/test'

import GetPublicServiceContextMenuV2Action from '@actions/v2/getPublicServiceContextMenuV2'

import PublicServiceService from '@services/public'

describe('GetPublicServiceContextMenuV2Action', () => {
    const testKit = new TestKit()
    const publicServiceServiceMock = mockInstance(PublicServiceService)
    const action = new GetPublicServiceContextMenuV2Action(publicServiceServiceMock)

    describe('method `handler`', () => {
        it('should successfully get public service context menu', async () => {
            const code = 'public-service-code'
            const args = {
                params: { code },
                headers: testKit.session.getHeaders(),
                session: testKit.session.getPartnerSession(),
            }

            jest.spyOn(publicServiceServiceMock, 'getPublicServiceContextMenu').mockResolvedValueOnce([])

            expect(await action.handler(args)).toEqual({ contextMenu: [] })

            expect(publicServiceServiceMock.getPublicServiceContextMenu).toHaveBeenCalledWith(code)
        })
    })
})
