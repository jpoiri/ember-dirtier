/* eslint-disable */
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    name() {
        return faker.lorem.sentence();
    },
    year() {
        return faker.random.number(1000);
    },
    releaseDate() {
        return faker.date.past();
    }
});
