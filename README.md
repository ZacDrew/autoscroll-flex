<h1> Autoscroll Flex </h1>

This is a tool primarily designed to assist with reading vertical scrolling comics like manhwa (and sometimes manga). <br>
Its purpose is to be a flexible autoscroll where the user can easily set the speeds and adjust them while reading without the interruption of clicking through a menu.

<h3>Features:</h3>
<ul>
    <li>Two scrolling modes
    <ul>
        <li><strong>Glide scroll</strong>
        <li><strong>Step scroll</strong>
    </ul>
    <li>Speed presets
    <li>A built-in (optional) hotkeys for:
    <ul>
        <li>toggling scroll on/off (spacebar)
        <li>changing direction (up/down arrows keys)
        <li>changing preset (left/right arrow keys)
    </ul>
    <li>A website blocklist where the addon is disabled
</ul>

<h3>Planned features:</h3>

- A customisable override of firefoxes default autoscroll (activated via middle click)
- The ability to configure new hotkeys
- An allowlist alternative to the blocklist

<br>

<h2>Local Installation</h2>
Download and unzip folder into desired location. <br>
<br>
Within the root directory (the unzipped folder) run:

```
npm install
```
```
npm run build
```
All files should be compiled into the "dist" folder. <br>
<br>
To load into firefox as a temporary addon, type `about:debugging` into the URL bar and go to "this firefox" 
on the side menu. <br>
Click "Load Temporary Add-on...", navigate to the unzipped folder and load the "manifest.json" file. <br>
<br>
Autoscroll Flex should now be in your addons menu.<br>
<br>

<h3>Build Enviroment</h3>
Build enviroment used for original development:
<ul>
    <li>Windows 11
    <li>x86 CPU architecture
    <li>npm v11.6.2
    <li>node v24.13.0
</ul>

<br>

<h2>Notes</h2>
Feel free to report bugs via the "Issues" tab in the
<a href="https://github.com/ZacDrew/autoscroll-flex" target="_blank">github</a> 
repo.
