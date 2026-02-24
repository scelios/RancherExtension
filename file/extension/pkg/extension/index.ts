import { importTypes } from '@rancher/auto-import';
import { IPlugin, CardLocation, TabLocation} from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
//   plugin.addCard(
//   CardLocation.CLUSTER_DASHBOARD_CARD,
//   {},
//   {
//     component: () => import('./components/showEvent.vue')
//   }
// );
  plugin.addTab( 
  TabLocation.RESOURCE_DETAIL,
  {}, 
  {
    name:       'Show Event',
    weight:     -5,
    component: () => import('./components/showEvent.vue')
  }
);
}
