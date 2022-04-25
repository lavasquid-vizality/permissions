import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default async module => {
  await Promise.resolve();
  return new Promise((resolve, reject) => {
    if (module instanceof Function.bind.constructor && module.length === 0) {
      const openContextMenuLazy = patch(getModule(m => m.openContextMenuLazy), 'openContextMenuLazy', args => {
        const _function = args[1];
        args[1] = async (...args) => {
          const func = await _function(...args);

          const _module = module();
          if (_module) {
            openContextMenuLazy();
            resolve(_module);
          }

          return func;
        };
      }, 'before');
    } else {
      reject(Error('Module is not a bound function or requires arguments'));
    }
  });
};
