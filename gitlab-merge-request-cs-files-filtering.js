    // ==UserScript==
    // @name        Gitlab Merge Request .cs files filtering
    // @namespace   https://github.com/Tointer
    // @include     https://*/-/merge_requests/*/diffs
    // @version     1
    // @author      Tointer
    // @updateURL   https://github.com/Tointer/GitLabCSButton
    // @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
    // @description This script will add special button that will hide all changes except ones in .cs files. Based on script by Jose Luis Canciani (https://github.com/josecanciani)
    // ==/UserScript==

    (function() {
        const scriptName = 'gitlab-merge-request-cs-files-filtering.js';
        const enableDebug = false;

        // simple debug method
        const debug = function(what, name) {
            if (!enableDebug) {
                return;
            }
            if (typeof(what) === 'string' || typeof(what) === 'number' || typeof(what) === 'undefined' || what === null) {
                console.log(scriptName + ': ' + (name ? name + ' is ' : '') + what);
            } else {
                console.log(scriptName + ': logging' + (name ? ' of ' + name : '') + ' starts here');
                console.log(what);
                console.log(scriptName + ': logging' + (name ? ' of ' + name : '') + ' ends here');
            }
        }

        // assert we have a valid observer
        const MyMutationObserver = this.MutationObserver || this.WebKitMutationObserver || (window ? window.MutationObserver || window.WebKitMutationObserver : null);
        if (!MyMutationObserver) {
            debug('MutationObserver not found, disabling plugin');
            return;
        }

        class App {
            /**
             * wait for the menu bar to appear before adding the button
             */

            start() {
                this._observer = new MyMutationObserver(this._doObserve.bind(this));
                this._observer.observe(document.body, {attributes:true, childList:true, subtree:true});
                debug('Starting observing DOM');
            }

            _doObserve() {
                const menu = document.querySelector('div.diff-stats.is-compare-versions-header');
                if (!menu) {
                    return;
                }
                debug('Stopping observing DOM');
                this._observer.disconnect();
                delete this._observer;
                this._addButtonToMenuBar(menu);
            }

            _addButtonToMenuBar(menu) {
                debug('Adding filter button');
                this._filterButton = document.createElement('img');
                this._filterButton.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJmlDQ1BBZG9iZSBSR0IgKDE5OTgpAAAoz2NgYDJwdHFyZRJgYMjNKykKcndSiIiMUmA/z8DGwMwABonJxQWOAQE+IHZefl4qAwb4do2BEURf1gWZxUAa4EouKCoB0n+A2CgltTiZgYHRAMjOLi8pAIozzgGyRZKywewNIHZRSJAzkH0EyOZLh7CvgNhJEPYTELsI6Akg+wtIfTqYzcQBNgfClgGxS1IrQPYyOOcXVBZlpmeUKBhaWloqOKbkJ6UqBFcWl6TmFit45iXnFxXkFyWWpKYA1ULcBwaCEIWgENMAarTQZKAyAMUDhPU5EBy+jGJnEGIIkFxaVAZlMjIZE+YjzJgjwcDgv5SBgeUPQsykl4FhgQ4DA/9UhJiaIQODgD4Dw745AMDGT/0ZOjZcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ5WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMS0wMVQyMDozNzowMiswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMS0wMVQyMDozODo1NyswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTEtMDFUMjA6Mzg6NTcrMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdjMGFmM2I1LWMyMGItMDI0My1hMzE1LWM2NzYyNThlZjdkMyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmM3Nzk5OGUyLWVhZTgtMTA0ZC05NmVhLTA4ZGNmYzIzZjdlNSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmEzZTIzOTQ2LTg1NDMtYWM0Zi1iNWY0LWIwYTg5YTI3ZDFlZCIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YTNlMjM5NDYtODU0My1hYzRmLWI1ZjQtYjBhODlhMjdkMWVkIiBzdEV2dDp3aGVuPSIyMDIxLTExLTAxVDIwOjM3OjAyKzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjgxYmFmMjczLTdjODYtN2I0MS1hNjRmLWM2MWI4MjJmY2I5ZCIgc3RFdnQ6d2hlbj0iMjAyMS0xMS0wMVQyMDozODozNiswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNzMwMDJkZS1iNzE1LWQxNDYtYjYzYy1kMzYzOTk4MzFhZmUiIHN0RXZ0OndoZW49IjIwMjEtMTEtMDFUMjA6Mzg6NTcrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6N2MwYWYzYjUtYzIwYi0wMjQzLWEzMTUtYzY3NjI1OGVmN2QzIiBzdEV2dDp3aGVuPSIyMDIxLTExLTAxVDIwOjM4OjU3KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE3MzAwMmRlLWI3MTUtZDE0Ni1iNjNjLWQzNjM5OTgzMWFmZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDphM2UyMzk0Ni04NTQzLWFjNGYtYjVmNC1iMGE4OWEyN2QxZWQiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphM2UyMzk0Ni04NTQzLWFjNGYtYjVmNC1iMGE4OWEyN2QxZWQiLz4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSIuQ1MiIHBob3Rvc2hvcDpMYXllclRleHQ9Ii5DUyIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+hp5f0QAAAaZJREFUWMPtlj+Kg0AUxgWrrVNtbbFY7wkkxR4giDcwB0jhAQStFwT7HCCwR0iVOtgLKS0D9rN+4RmekzdmDIQsrB+8Jr6Z+c37N3GUUs4rzZkBZoCXA8yaKK+zTWepZiuD/0rw7e19ysFwLoMgUEVRqO12O7AkSZDMkvmvOzvid923N9/3sWZhc/gHNseiMXU+MLezCJvXdT3qH8cx/Jc2AOVut1P3xAD2VVXd9bcF+AzDcLCwbVsxpJSCBW7PhUhI/kgn1dSoUj30RJ4bisrDxlyoGYLT/T2b8N8AsFCbdGqaZrAGKaSiy6dW/yMACdKGVEmpI5DkmQBQjlRIxYjoAJCi8TQAKEJHoGZ0EERDmgOusPENAFVvxPwlGP7tApJlmVScmysp3ayv2DdTG+I2RM/tSNPPofX6dyXtQ+cOBwcnI/0cDofRoYJeJ4glQm4jfs4AgJORvmxGK93UCgB78Rr45qNWALg+LqgHEwgBXAaR3oK8A9hMWA8eG5avPdWF9CKmFGolWP8aor3OBp8TLkxnGivXRq5gj/j8Ac3/imeAfw/wC+nBvGhvoIVnAAAAAElFTkSuQmCC';
                this._filterButton.classList.add('btn');
                this._filterButton.style = 'width: 34px; height: 34px; padding: 6px 6px;';
                this._filterButton.addEventListener('click', this._filterFilesByString.bind(this));
                let div = document.createElement('div');
                div.classList.add('diff-stats-group');
                div.appendChild(this._filterButton);
                menu.appendChild(div);
            }

            _filterFilesByString() {
                let filterCount = 0;

                document.querySelectorAll('div.diff-file.file-holder').forEach(function (file) {
                    let filePath = file.getAttribute('data-path');
                    if(filePath == null){
                        return;
                    }
                    let hide = !filePath.match("\\.(cs)$");
                    if (hide) {
                        filterCount++;
                    }
                    hide && debug('Hiding ' + filePath);
                    file.style.display = hide ? 'none' : 'block';
                });
                this._filterButton.style['background-color'] = filterCount ? '#3b4247' : 'unset';
            }
        }

        (new App()).start();
    })(this);
