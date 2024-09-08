// ts-worksheet-with-variables
import {
  tNode,
  tArch,
  tSolaxData,
  tPowerNodeID,
  tPowerArchID,
} from '../Solax/Types';

class PowerInput {
  updateArchData(
    solaxData: tSolaxData | null,
    arches: Map<tPowerArchID, tArch>
  ) {
    if (!solaxData) return;

    // battery - what is bat Power? and status ?
    const batArch = arches.get('battery_inverter');
    const { batStatus, batPower } = solaxData;

    if (batArch) {
      batArch.flow = batStatus === '0' ? 'positive' : 'negative';
      batArch.current = batPower > 1000 ? 'high' : 'low';
    }

    // grid - wath is feedin power
    const gridArch = arches.get('grid_inverter');
    const { feedinenergy } = solaxData;

    if (gridArch) {
      gridArch.flow = feedinenergy > 0 ? 'negative' : 'positive';
      gridArch.current = Math.abs(feedinenergy) > 1000 ? 'high' : 'low';
    }

    // load = what is consume energy
    const loadArch = arches.get('load_inverter');
    const { consumeenergy } = solaxData;

    if (loadArch) {
      loadArch.flow = consumeenergy > 0 ? 'negative' : 'positive';
      loadArch.current = consumeenergy > 1000 ? 'high' : 'low';
    }

    // pv
    const pvArch = arches.get('pv_inverter');
    const { yieldtoday } = solaxData;

    if (pvArch) {
      pvArch.flow = yieldtoday > 0 ? 'positive' : 'negative';
      pvArch.current = yieldtoday > 1000 ? 'high' : 'low';
    }
  }

  updateNodeData(
    solaxData: tSolaxData | null,
    nodes: Map<tPowerNodeID, tNode>
  ) {
    if (!solaxData) return;

    const pvNode = nodes.get('pv');
    const { yieldtoday } = solaxData;

    if (pvNode) {
      pvNode.activity.active = yieldtoday > 1.0;
      pvNode.labels[1].text = `${yieldtoday.toFixed(0)}Kwh`;
    }

    const pvBattery = nodes.get('battery');
    const { soc } = solaxData;

    if (pvBattery) {
      pvBattery.activity.active = soc > 1.0;
      pvBattery.labels[1].text = `${soc.toFixed(0)}%`;
    }

    const pvGrid = nodes.get('grid');
    const { feedinenergy } = solaxData;

    if (pvGrid) {
      pvGrid.activity.active = feedinenergy !== 0;
      pvGrid.activity.currIconIndex = feedinenergy < 0 ? 0 : 1;
      pvGrid.labels[1].text = `${feedinenergy.toFixed(0)}KwH`;
    }

    const pvLoad = nodes.get('load');
    const { consumeenergy } = solaxData;

    if (pvLoad) {
      pvLoad.activity.active = consumeenergy > 1.0;
      pvLoad.labels[1].text = `${consumeenergy.toFixed(0)}KwH`;
    }
  }
}

export { PowerInput };
