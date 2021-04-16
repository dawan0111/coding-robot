import { createSelectorHook } from 'react-redux';
import { RootState } from '../stores/modules';

export const useRootSelector = createSelectorHook<RootState>()
