import {Navigation} from 'react-native-navigation';
import * as layoutConverter from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import {generateGuid} from './utils';


const originalShowModal = Navigation.showModal.bind(Navigation);
Navigation.showModal = (params) => {
  originalShowModal(layoutConverter.convertComponentStack(params));
};

export function generateNavigator(component) {
  const navigator = {
    id: generateGuid(),
    isVisible: false,
    eventFunc: undefined,
    push(params) {
      setPropsCommandType(params, "Push");
      Navigation.push(this.id, layoutConverter.convertComponent(params));
    },
    pop() {
      Navigation.pop(this.id);
    },
    popToRoot() {
      Navigation.popToRoot(this.id);
    },
    resetTo(params) {
      Navigation.setStackRoot(this.id, layoutConverter.convertComponent(params));
    },
    showModal(params) {
      setPropsCommandType(params, "ShowModal");
      originalShowModal(layoutConverter.convertComponentStack(params));
    },
    dismissModal() {
      Navigation.dismissModal(this.id);
    },
    setButtons(buttons) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          ...optionsConverter.convertButtons(buttons)
        }
      });
    },
    setTitle({title}) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          title: {
            text: title
          }
        }
      });
    },
    setSubTitle({subtitle}) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          subtitle: {
            text: subtitle
          }
        }
      });
    },
    toggleTabs({to, animated}) {
      Navigation.mergeOptions(this.id, {
        bottomTabs: {
          visible: to === 'shown',
          animated
        }
      });
    },
    toggleDrawer({side, animated}) {
      Navigation.mergeOptions(this.id, {
        sideMenu: {
          [side]: {
            visible: true
          }
        }
      });
    },
    setTabBadge({badge}) {
      Navigation.mergeOptions(this.id, {
        bottomTab: {
          badge
        }
      });
    },
    switchToTab(tabIndex) {
      const options = tabIndex ? {
        currentTabIndex: tabIndex
      } : {
          currentTabId: this.id
        };

      Navigation.mergeOptions(this.id, {
        bottomTabs: options
      });
    },
    toggleNavBar({to, animated}) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          visible: to === 'shown',
          animate: animated
        }
      });
    },
    setStyle(style) {
      Navigation.mergeOptions(this.id, optionsConverter.convertStyle(style));
    },
    screenIsCurrentlyVisible() {
      return this.isVisible;
    },
    addOnNavigatorEvent(func) {
      this.eventFunc = func;
    },
    setOnNavigatorEvent(func) {
      this.eventFunc = func;
    }
  };

  return navigator;
}

function setPropsCommandType(params, commandType) {
  if (params && params.props) {
    params.props.commandType = commandType;
  }
}