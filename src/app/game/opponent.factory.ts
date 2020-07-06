import {SettingsService} from "../settings/settings.service";
import {OpponentType} from "../ttt.types";
import {DumbOpponentService} from "./dumb-opponent.service";
import {ComputerOpponentService} from "./computer-opponent.service";
import {Opponent} from "./opponent";

export function OpponentFactory(settingsService: SettingsService): Opponent {
  const playersMap = settingsService.gameConfig.players;
  const playersArr = Object.values(playersMap);
  const isDumbOpponent = playersArr.some(player => player.opponentType === OpponentType.COMPUTER && player.mark === "🐔");
  return isDumbOpponent ? new DumbOpponentService() : new ComputerOpponentService();
}
