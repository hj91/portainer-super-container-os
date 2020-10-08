import angular from 'angular';

import { AgentViewModel } from '../models/agent';

angular.module('portainer.agent').factory('AgentService', AgentServiceFactory);

function AgentServiceFactory(Agent, AgentVersion1, HttpRequestHelper, Host, StateManager) {
  return {
    agents,
    hostInfo,
  };

  function getAgentApiVersion() {
    const state = StateManager.getState();
    return state.endpoint.agentApiVersion;
  }

  function hostInfo(nodeName) {
    HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);
    return Host.info().$promise;
  }

  async function agents() {
    const agentVersion = getAgentApiVersion();
    const service = agentVersion > 1 ? Agent : AgentVersion1;
    try {
      const agents = await service.query({ version: agentVersion }).$promise;
      return agents.map(function (item) {
        return new AgentViewModel(item);
      });
    } catch (err) {
      throw { msg: 'Unable to retrieve agents', err };
    }
  }
}
