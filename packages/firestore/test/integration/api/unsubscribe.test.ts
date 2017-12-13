import { apiDescribe, withTestCollection } from '../util/helpers';
import { EventsAccumulator } from '../../util/helpers';

apiDescribe('Unsubscribe', persistence => {
  it('can be removed', () => {
    return withTestCollection(persistence, {}, collection => {
      const docRef = collection.doc();
      const events = new EventsAccumulator<void>();
      const onEvent = () => {
        events.storeEvent(void 0);
      };
      const unsubscribe1 = collection.onSnapshot(onEvent);
      const unsubscribe2 = docRef.onSnapshot(onEvent);
      return events
        .awaitEvents(2)
        .then(() => {
          docRef.set({ foo: 'bar' });
          return events.awaitEvents(2);
        })
        .then(() => {
          unsubscribe1();
          unsubscribe2();

          return docRef.set({ foo: 'baz' });
        })
        .then(() => {
          return events.assertNoAdditionalEvents();
        });
    });
  });
});
