import { SetMetadata } from '@nestjs/common';
import { ActionMode } from '../constants/action-mode.enum';

export const ACTION_KEY = 'requires_action';
export const RequiresAction = (action: string, mode: ActionMode = ActionMode.ANY) =>
  SetMetadata(ACTION_KEY, { action, mode });