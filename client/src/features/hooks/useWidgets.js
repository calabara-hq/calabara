import axios from 'axios';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDashboardRuleResults, selectDashboardRules } from '../gatekeeper/gatekeeper-rules-reducer';
import useGatekeeper from './useGatekeeper';
import {
    selectInstallableWidgets,
    selectInstalledWidgets,
    setVisibleWidgets,
    setInstallableWidgets,
    setInstalledWidgets,
    selectVisibleWidgets
} from '../dashboard/dashboard-widgets-reducer';

export default function useWidgets() {
    const installedWidgets = useSelector(selectInstalledWidgets);
    const installableWidgets = useSelector(selectInstallableWidgets);
    const visibleWidgets = useSelector(selectVisibleWidgets);
    const dashboardRules = useSelector(selectDashboardRules);
    const ruleResults = useSelector(selectDashboardRuleResults)
    const { testDiscordRoles } = useGatekeeper();
    const dispatch = useDispatch();

    const populateVisibleWidgets = (isAdmin) => {

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


        // if they are an admin, just show them everything
        if (isAdmin) {
            filteredWidgets = installedWidgets;
        }

        // check the gatekeeper configured for each widget

        else {
            installedWidgets.map(function (widget) {


                if (Object.keys(widget.gatekeeper_rules).length == 0) {
                    // no rules set. add all to filtered widgets
                    filteredWidgets.push(widget);
                }
                else {
                    for (const [key, value] of Object.entries(widget.gatekeeper_rules)) {
                        // if value is an object, it's a discord rule
                        if (typeof value === 'object') {
                            // map over role values and check if any of them match the rule_id's that are in gatekeeper ruleResults
                            // only run comparisons once we have values for ruleResults
                            const roleTestResult = testDiscordRoles(value, ruleResults[key])
                            if (roleTestResult === 'pass') {
                                filteredWidgets.push(widget);
                                break;
                            }
                        }

                        // otherwise, it's an erc20/erc721 rule
                        else {
                            if (ruleResults[key] >= value) {
                                filteredWidgets.push(widget)
                                break;
                            }
                        }
                    }
                }
            })
        }

        dispatch(setVisibleWidgets(filteredWidgets))

    }

    const updateWidgets = (condition, widget) => {

        if (condition == 0) {
            // remove from installedWidgets
            const installedWidgetsApplyRemoved = installedWidgets.filter(function (e) {
                return e.name != widget.name;
            })

            dispatch(setInstalledWidgets(installedWidgetsApplyRemoved))

            // add to installableWidgets
            var temp = installableWidgets.concat(widget)
            dispatch(setInstallableWidgets(temp))


        }
        else if (condition == 1) {
            //remove from installableWidgets
            const installableWidgetsApplyRemoved = installableWidgets.filter(function (e) {
                return e.name != widget.name;
            })

            dispatch(setInstallableWidgets(installableWidgetsApplyRemoved))



            // add to installedWidgets
            var temp = installedWidgets.concat(widget)
            dispatch(setInstalledWidgets(temp))
        }
    }

    const updateWidgetMetadata = (widget, metadata) => async (dispatch, getState) => {

        let widgetsCopy = JSON.parse(JSON.stringify(installedWidgets));


        for (var i in widgetsCopy) {
            if (widgetsCopy[i].name == widget) {
                widgetsCopy[i].metadata = metadata
                break;
            }
        }

        dispatch(setInstalledWidgets(widgetsCopy))

    }

    const updateWidgetGatekeeper = (widget, gk_rules) => {

        let widgetsCopy = JSON.parse(JSON.stringify(installedWidgets));


        for (var i in widgetsCopy) {
            if (widgetsCopy[i].name == widget) {
                widgetsCopy[i].gatekeeper_rules = gk_rules;
                break;
            }
        }

        dispatch(setInstalledWidgets(widgetsCopy))

    }


    /**
    not yet implemented
    **/
    const setWidgetNotification = (widgetName) => {

        for (var i in visibleWidgets) {
            if (visibleWidgets[i].name == widgetName) {
                // dispatch(setNotification(i))
                break;
            }
        }

    }

    return {
        populateVisibleWidgets: (isAdmin) => {
            populateVisibleWidgets(isAdmin)
        },
        updateWidgets: (condition, widget) => {
            updateWidgets(condition, widget)
        },
        updateWidgetMetadata: (widget, metadata) => {
            updateWidgetMetadata(widget, metadata)
        },
        updateWidgetGatekeeper: (widget, gk_rules) => {
            updateWidgetGatekeeper(widget, gk_rules);
        },
        setWidgetNotification: (widgetName) => {
            setWidgetNotification(widgetName)
        }
    }
}