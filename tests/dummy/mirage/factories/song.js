/* eslint-disable */
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    song() {
        return faker.lorem.sentence();
    },
    instruments: ['guitar', 'bass', 'drums']
});
