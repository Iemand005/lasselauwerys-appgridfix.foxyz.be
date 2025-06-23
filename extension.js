/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import Clutter from 'gi://Clutter';

export default class PlainExampleExtension extends Extension {
    enable() {
        const appDisplay = Main.overview._overview._controls._appDisplay;
        const appGrid = appDisplay._grid;
        const swipeTracker = appGrid._delegate._swipeTracker;

        const children = appGrid.get_children();

        for (let i = 0; i < children.length; ++i) {
            console.debug(i);
            const appIcon = children[i];

            let startPos = 0;
            let lastPos = 0;

            appIcon.connect('touch-event', (actor, event) => {
                const type = event.type();
                const coords = event.get_coords();
                const time = event.get_time();
                const pos = coords[0];
                const distance = appGrid._delegate._adjustment.page_size;
                const progress = appGrid._currentPage - (pos - startPos) / appGrid._delegate._adjustment.page_size;
                
                console.debug(event, pos, time, progress);
                
                switch (type) {
                    case Clutter.EventType.TOUCH_BEGIN:
                    swipeTracker._beginTouchSwipe(this, time, coords[0], coords[1]);
                    startPos = pos;
                    lastPos = startPos;

                    break;
                case Clutter.EventType.TOUCH_UPDATE:
                    appIcon._delegate._removeMenuTimeout();

                    const delta = -(pos - lastPos);
                    lastPos = pos;

                    swipeTracker._updateGesture(this, time, delta, distance);
                    break;
                case Clutter.EventType.TOUCH_END:
                    swipeTracker._endTouchGesture(this, time, distance);
                    return true;
                }
            });
        }
    }

    disable() {
    }
}
