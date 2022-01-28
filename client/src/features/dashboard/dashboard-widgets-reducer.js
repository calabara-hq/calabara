import { createSlice } from '@reduxjs/toolkit';


// installed widgets --> all widgets this org has installed on their dashboard
// installable widgets --> supported widgets - installed widgets for an org dashboard
// visibleWidgets --> subset of installed widgets that is different depending on the result of the gatekeeper check

export const dashboardWidgets = createSlice({
  name: 'dashboardWidgets',
  initialState: {
    installedWidgets:[],
    installableWidgets: [],
    visibleWidgets: []
  },
  reducers: {

    setInstalledWidgets: (state, data) => {
      state.installedWidgets = data.payload;
    },

    setInstallableWidgets: (state, data) => {
      state.installableWidgets = data.payload;
    },

    setVisibleWidgets: (state, data) => {
      state.visibleWidgets = data.payload;
    },

    // takes an index as argument
    setNotification: (state, data) => {
      state.visibleWidgets[data.payload].notify = 1;
    },


  },
});

export const { setInstalledWidgets, setInstallableWidgets, setVisibleWidgets, setNotification } = dashboardWidgets.actions;


export const populateInitialWidgets = (ens) => async (dispatch, getState, axios) => {

  var installed = await axios.get('/dashboardWidgets/' + ens)
  // set initial notification status to 0
  installed.data.widgets.map(el => el['notify'] = 0)
  dispatch(setInstalledWidgets(installed.data.widgets))

  var installable = await axios.get('/availableWidgets/' + ens)
  installable.data.items.map(el => el['notify'] = 0)
  dispatch(setInstallableWidgets(installable.data.items))

}

export const populateVisibleWidgets = () => async (dispatch, getState) => {

  const { dashboardWidgets, gatekeeperRules } = getState();
  
  // rule results stores {rule_id: balance}
  // widget gatekeeper_rules store the contract definition and the thresholds. 
  // for each gatekeeper rule of each widget, we just check that rule result balance > threshold
  // if the above condition is true for atleast 1 rule in the gatekeeper_rules object, we add the widget to visible widgets and break
  let filteredWidgets = [];


  /* 
  there are 2 cases. 
  1. there are gatekeeper rules set. --> filter based on token balances
  2. there are no gatekeeper rules set. --> set all widgets visible
  */



    // check the gatekeeper configured for each widget
    dashboardWidgets.installedWidgets.map(function(widget){
      
      if(Object.keys(widget.gatekeeper_rules).length == 0){
        // no rules set. add all to filtered widgets
        filteredWidgets.push(widget);
      }
      else{
        for (const [key, value] of Object.entries(widget.gatekeeper_rules)){
          if(gatekeeperRules.ruleResults[key] >= value){
            filteredWidgets.push(widget)
            break;
          }
        }
     }
      })

    dispatch(setVisibleWidgets(filteredWidgets))
    

}


// function to update installable widgets and all widgets based on addition or deletion of widgets
// condition = 0 --> widget removed --> add widget to installable widgets and remove from allWidgets
// condition = 1 --> widget added --> remove widget from installable widgets and add to allWidgets
export const updateWidgets = (condition, widget) => async (dispatch, getState) => {

  const { dashboardWidgets } = getState();

  if(condition == 0){
    // remove from installedWidgets
    const installedWidgetsApplyRemoved = dashboardWidgets.installedWidgets.filter(function(e){
      return e.name != widget.name;
    })
    dispatch(setInstalledWidgets(installedWidgetsApplyRemoved))

    // add to installableWidgets
    var temp = dashboardWidgets.installableWidgets.concat(widget)
    dispatch(setInstallableWidgets(temp))


  }
  else if(condition == 1){
    //remove from installableWidgets
    const installableWidgetsApplyRemoved = dashboardWidgets.installableWidgets.filter(function(e){
      return e.name != widget.name;
    })
    dispatch(setInstallableWidgets(installableWidgetsApplyRemoved))



    // add to installedWidgets
    var temp = dashboardWidgets.installedWidgets.concat(widget)
    dispatch(setInstalledWidgets(temp))


  }

}

export const updateWidgetMetadata = (widget, metadata) => async (dispatch, getState) => {
  const { dashboardWidgets } = getState();

  let widgetsCopy = JSON.parse(JSON.stringify(dashboardWidgets.installedWidgets));


  for (var i in widgetsCopy){
    if(widgetsCopy[i].name == widget){
      widgetsCopy[i].metadata = metadata
      break;      
    }
  }

  dispatch(setInstalledWidgets(widgetsCopy))

}

export const updateWidgetGatekeeper = (widget, gk_rules) => async (dispatch, getState) => {
  const { dashboardWidgets } = getState();

  let widgetsCopy = JSON.parse(JSON.stringify(dashboardWidgets.installedWidgets));


  for (var i in widgetsCopy){
    if(widgetsCopy[i].name == widget){
      widgetsCopy[i].gatekeeper_rules = gk_rules;
      break;      
    }
  }

  dispatch(setInstalledWidgets(widgetsCopy))

}

export const setWidgetNotification = (widgetName) => async (dispatch, getState) => {

  const { dashboardWidgets } = getState();

  for(var i in dashboardWidgets.visibleWidgets){
    if(dashboardWidgets.visibleWidgets[i].name == widgetName){
      dispatch(setNotification(i))
      break;
    }
  }

}

export const clearWidgets = () => async (dispatch, getState) => {

  const { dashboardWidgets } = getState();

  dispatch(setInstalledWidgets([]));
  dispatch(setInstallableWidgets([]));
  dispatch(setVisibleWidgets([]));

}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`


export const selectInstalledWidgets = state => state.dashboardWidgets.installedWidgets;
export const selectInstallableWidgets = state => state.dashboardWidgets.installableWidgets;
export const selectVisibleWidgets = state => state.dashboardWidgets.visibleWidgets;




export default dashboardWidgets.reducer;
