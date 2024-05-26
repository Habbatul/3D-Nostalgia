import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';


export default defineConfig({
  assetsInclude: ['**/*.glb'],
  plugins: [
    viteStaticCopy({
      targets: [
        {
            src: 'gltf/*',
            dest: 'gltf'
          },
          {
            src: 'audio/*',
            dest: 'audio'
          },
          {
            src: 'hdri/*',
            dest: 'hdri'
          },
          {
            src: 'texture/*',
            dest: 'texture'
          }
      ]
    })
  ],
  base : '/3D-Nostalgia/'
});
