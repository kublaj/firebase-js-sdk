/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
