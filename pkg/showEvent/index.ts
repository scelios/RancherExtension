import { importTypes } from '@rancher/auto-import';
import { IPlugin, CardLocation, TabLocation, PanelLocation, ActionLocation, ActionOpts} from '@shell/core/types';
import { useShell } from '@shell/apis';
import { useNavigate } from 'react-router-dom';
// Init the package
export default function(plugin: IPlugin): void {
  // const shellApi = useShell();
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  plugin.addTab( 
  TabLocation.RESOURCE_DETAIL,
  {}, 
  {
    name:       'Show Event',
    weight:     -5,
    component: () => import('./components/pop.vue')

  }
  );

  plugin.addCard(
  CardLocation.CLUSTER_DASHBOARD_CARD,
  { },
  {
    label:     'try',
    // labelKey:  'generic.comingSoon',
    component: () => import('./components/helloWorld.vue')
  }
  );
  
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
      // console.log('table action executed 1', this, opts, values); // eslint-disable-line no-console
      const navigate = useNavigate();
      navigate('/home');
      const resource = values[0];
      const shell = resource?.$root?.$shell || resource?.$shell;

      if (shell) {
        shell.slideIn.open({
            component: () => import('./components/pop.vue'),
            title:     'Show Event', 
            width:     500,
            props:     { values } // Optional: Pass the selected rows to your component props
          });
      } else {
        console.error("Could not find shell instance on resource", resource);
      }
    }
  }
);
  plugin.metadata.icon = require('./eyes.svg');
}
