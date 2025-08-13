## An Enact application for showcasing the customization options for our components

Run `npm install` then `npm run serve` to have the app running on [http://localhost:8080](http://localhost:8080), where you can view it in your browser.
You can focus each button to see the customization applied to it.

The easiest way to customize the color of our components is to change the value of our design tokens used in creating them.
In this case, we customized the app on three different layers to show how the changes cascade. We kept the customization 
sparse to better show the process (just the background and text of a focused button). 

The first thing you should do to customize an app or component should be to understand the variables that are responsible
for the expected changes. You can find the variables used in limestone here: [Limestone Repo](https://github.com/enactjs/limestone/blob/master/styles/colors.less).

For this demo I want to change the colors of a focused button (`--semantic-color-on-surface-main-focused` and `--semantic-color-surface-default-focused`).
Then I create a config file for my changes inside `src` file. There I create three different configs to use inside my app.

The first config, called `appColors`, will be applied as close to the root of the app as possible. This config will affect the 
entire app. This is not recommended as our colors are responsible for multiple components and this kind of change can have
 unexpected behavior.

The second config, called `containerColors`, will be applied to a container inside MainPanel. This config will apply to 
the components that are inside it. This one is better to use if our container has a limited number of different components
that can be changed using a small number of variables.

The last config, called `buttonColors`, will be applied to a single component (a button). This is the best way to customize
a component as any change made inside the config will only be applied to it.

The colors changed by these configs apply in a cascade. These changes will be overwritten by further configs. In our case
`containerColors` overwrites `appColors` for the second button and `buttonColors` overwrites `containerColors` for the third.
