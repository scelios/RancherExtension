import { importTypes } from '@rancher/auto-import';
import { IPlugin, CardLocation, TabLocation, PanelLocation, ActionLocation, ActionOpts} from '@shell/core/types';
import { useShell } from '@shell/apis';
import fileToRender from './components/showEvent.vue';

// Init the package
export default function(plugin: IPlugin): void {
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  plugin.addAction(
  ActionLocation.TABLE,
  {  }, 
  {
    label:    'Show Event',
    icon:     'icon-show',
    enabled(ctx: any) {
      return true;
    },
    invoke(opts: ActionOpts, values: any[]) {
      // const router = (window as any).$nuxt?.$router; // Try accessing global nuxt router
      
      // if (router) {
      //   router.push({ path: '/home' });
      // }
      // else
      // {
      //   console.error("Could not find router instance", (window as any).$nuxt);
      // }


      const shell = (window as any).$globalApp?.$shell;

      if (shell) {
        // console.log("Name of the resource:", values[0]?.metadata?.name);
        // if (values[0]?.metadata?.name.includes('.')) {
        //   //remove the part after the dot, which is the namespace
        //   values[0].metadata.name = values[0].metadata.name.split('.')[0];
        // }
        shell.slideIn.open(fileToRender, {
          // Some versions of shell/nuxt might flatten props, so let's try passing it directly in the object
          // AND nested in props just in case.
          resource: values[0], 
          props: { resource: values[0] },
          title: 'Show Event',
          width: '80%'
        });
      } else {
        console.error("Could not find shell instance");
      }
    }
  }
);
  plugin.metadata.icon = require('./eyes.svg');
}
