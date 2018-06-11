import { Scene } from 'affinity-engine-stage';
import { task } from 'ember-concurrency';

export default Scene.extend({
  start: task(function * (script) {
    const choice = yield script.menu([
      'gold lamé mom jeans',
      'corduroy cargo shorts',
      'plaid lined skort',
      'long johns',
      'red & gold sport shorts',
      'very old pair of bellbottoms'
    ], {
      text: 'Oh no! Your alarm is going off and you don\'t have time to check the weather! Quick, grab a pair of pants and hope for the best.'
    });

    this.get('result').perform(script, choice);
  }),

  result: task(function * (script, choice) {
    const pants = yield script.image(this.determinePants(choice)).position('center').fadeIn();
    const weather = yield this.get('determineWeather').perform(script);
    const event = yield this.get('determineEvent').perform(script);
    const weatherText = this.composeWeatherText(weather, choice);
    const eventText = this.composeEventText(event, choice);

    yield script.text(weatherText);
    yield script.text(eventText);
    yield pants.fadeOut();

    this.get('start').perform(script);
  }),

  determinePants(choice) {
    switch (choice.key) {
      case 0: return 'lame';
      case 1: return 'cargo-shorts';
      case 2: return 'skort';
      case 3: return 'long-johns';
      case 4: return 'sport-shorts';
      case 5: return 'bell-bottoms';
    }
  },

  determineEvent: task(function * (script) {
    switch (yield script.random(0, 2)) {
      case 0: return 'crush';
      case 1: return 'active';
      case 2: return 'comfortable';
    }
  }),

  determineWeather: task(function * (script) {
    switch (yield script.random(0, 1)) {
      case 0: return 'warm';
      case 1: return 'cold';
    }
  }),

  composeWeatherText(weather, choice) {
    if (weather === 'warm') {
      const text = 'It was warm today';

      if ([1, 2, 4].includes(choice.key)) {
        return `${text}, but you stayed cool!`;
      } else {
        return `${text} and you overheated. . . .`;
      }
    } else if (weather === 'cold') {
      const text = 'It was cold today';

      if ([0, 3, 5].includes(choice.key)) {
        return `${text}, but you stayed warm!`;
      } else {
        return `${text} and you didn't have enough protection. . . .`;
      }
    }
  },

  composeEventText(event, choice) {
    if (event === 'crush') {
      const text = 'On your way home, you saw your crush!';

      if (choice.key === 0) return `${text} And your butt looked great in your ${choice.text}!`;
      else if (choice.key === 2) return `${text} And you looked cute in your ${choice.text}!`;
      else return `${text} But how did you look in your ${choice.text}?`
    } else if (event === 'active') {
      const text = 'After work, you decided to go for a jog.';

      if (choice.key === 3) return `${text} And your ${choice.text} were surprisingly up for the job!`;
      else if (choice.key === 4) return `${text} And your ${choice.text} were perfect!`;
      else return `${text} But it was kind of awkward in your ${choice.text}. . . .`
    } else if (event === 'comfortable') {
      const text = 'After work, you took a stroll on the beach';

      if (choice.key === 1) return `${text} and filled your ${choice.text}' pockets with beautiful clam shells!`;
      else if (choice.key === 5) return `${text}, and in your ${choice.text} you felt free-spirited!`;
      else return `${text}, but you were uncomfortable with the sand getting in your ${choice.text}. . . .`
    }
  }
});
