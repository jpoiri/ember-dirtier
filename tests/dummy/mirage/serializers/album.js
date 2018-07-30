/* eslint-disable */
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    include: ['songs', 'artist']
});
