import { createUnplugin } from 'unplugin';
import type {Plugin} from 'vite'
import { createFilter } from '@rollup/pluginutils';
import { transform } from './src';
import type { FilterPattern } from '@rollup/pluginutils';
export { default as unpluginVueRef } from './src/client';

export interface Options {
	include?: FilterPattern;
	exclude?: FilterPattern;
}

function resolveOption(options: Options): Options {
	return {
		include: options.include || [/\.vue$/],
		exclude: options.exclude || undefined
	};

}
export const unplugin = createUnplugin((userOptions: Options) => {
	const options = resolveOption(userOptions);
	const filter = createFilter(options.include, options.exclude);
	return {
		name: 'unplugin-vue-ref',
		transformInclude(id) {
			return filter(id);
		},
		transform(code, id) {
			if (filter(id)) transform(code,id);
      return null
		}
	};
});

export const vitePlugin = unplugin.vite as unknown as Plugin;
export const rollupPlugin = unplugin.rollup;
export const webpackPlugin = unplugin.webpack;
export const esbuildPlugin = unplugin.esbuild;
