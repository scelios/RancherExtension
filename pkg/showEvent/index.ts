import { importTypes } from '@rancher/auto-import';
import { IPlugin, CardLocation, TabLocation, PanelLocation, ActionLocation, ActionOpts} from '@shell/core/types';
import { useShell } from '@shell/apis';
import pop from './components/pop.vue';

// Init the package
export default function(plugin: IPlugin): void {
  // const shellApi = useShell();
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  // plugin.addTab( 
  // TabLocation.RESOURCE_DETAIL,
  // {}, 
  // {
  //   name:       'Show Event',
  //   weight:     -5,
  //   component: () => import('./components/pop.vue')

  // }
  // );

  // plugin.addCard(
  // CardLocation.CLUSTER_DASHBOARD_CARD,
  // { },
  // {
  //   label:     'try',
  //   // labelKey:  'generic.comingSoon',
  //   component: () => import('./components/helloWorld.vue')
  // }
  // );
  
  plugin.addPanel(
    PanelLocation.DETAILS_MASTHEAD,
    {},
    { 
      component: () => import('./components/helloWorld.vue')
    }
  );
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
        // Try passing the raw target object if it's a proxy
        
        shell.slideIn.open(pop, {
          // Some versions of shell/nuxt might flatten props, so let's try passing it directly in the object
          // AND nested in props just in case.
          resource: values[0], 
          props: { resource: values[0] },
          title: 'Show Event',
          width: '50%'
        });
      } else {
        console.error("Could not find shell instance");
      }
    }
  }
);
  plugin.metadata.icon = require('./eyes.svg');
}
