import { AccessControlService } from './access-control.service';
export declare class AccessControlController {
    private readonly accessControlService;
    constructor(accessControlService: AccessControlService);
    grantAccess(data: any): void;
    revokeAccess(data: any): void;
}
