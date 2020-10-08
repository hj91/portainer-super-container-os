export class EditEdgeGroupController {
  /* @ngInject */
  constructor(EdgeGroupService, GroupService, TagService, Notifications, $state, $async, EndpointService, EndpointHelper) {
    this.EdgeGroupService = EdgeGroupService;
    this.GroupService = GroupService;
    this.TagService = TagService;
    this.Notifications = Notifications;
    this.$state = $state;
    this.$async = $async;
    this.EndpointService = EndpointService;
    this.EndpointHelper = EndpointHelper;

    this.state = {
      actionInProgress: false,
      loaded: false,
    };

    this.updateGroup = this.updateGroup.bind(this);
    this.updateGroupAsync = this.updateGroupAsync.bind(this);
  }

  async $onInit() {
    const [tags, endpointGroups, group] = await Promise.all([this.TagService.tags(), this.GroupService.groups(), this.EdgeGroupService.group(this.$state.params.groupId)]);

    if (!group) {
      this.Notifications.error('Failed to find edge group', {});
      this.$state.go('edge.groups');
    }
    this.tags = tags;
    this.endpointGroups = endpointGroups;
    this.model = group;
    this.state.loaded = true;
  }

  updateGroup() {
    return this.$async(this.updateGroupAsync);
  }

  async updateGroupAsync() {
    this.state.actionInProgress = true;
    try {
      await this.EdgeGroupService.update(this.model);
      this.Notifications.success('Edge group successfully updated');
      this.$state.go('edge.groups');
    } catch (err) {
      this.Notifications.error('Failure', err, 'Unable to update edge group');
    } finally {
      this.state.actionInProgress = false;
    }
  }
}
