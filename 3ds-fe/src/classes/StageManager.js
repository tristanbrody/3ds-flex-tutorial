class StageManager {
  constructor() {
    this.currentStage = 0;
  }

  callNextStage() {
    switch (this.currentStage) {
      case 1:
        this.stageOne();
        break;
      case 2:
        this.stageTwo();
        break;
      case 3:
        this.stageThree();
        break;
      case 4:
        this.stageFour();
        break;
      case 5:
        this.stageFive();
        break;
      default:
    }
  }

  stageOne() {
    //to be overriden
  }
  stageTwo() {
    //to be overriden
  }
  stageThree() {
    //to be overriden
  }
  stageFour() {
    //to be overriden
  }
  stageFive() {
    //to be overriden
  }
}
