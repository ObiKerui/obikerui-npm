import * as d3 from 'd3';
import { Node } from '../Lib/Node/Node';
import { Arch } from '../Lib/Node/Arch';
import { tNode, tPowerArchID, tPowerNodeID, tArch } from '../Solax/Types';
import { tIconModel } from '../Lib/Node/Icon';
import { tPowerRouter, usePowerRouter } from '../Solax/Store';
// import { useBatteryChart } from './Chart/Chart';
import { darkProfile, lightProfile, powerNodeToCategory } from '../Solax/Model';
import { tActivityModel } from '../Lib/Node/Activity';

function updateUI(newValue: tPowerNodeID) {
  usePowerRouter.getState().setFocus(newValue);
  const currNodes = usePowerRouter.getState().nodes;
  const currNode = currNodes.get(newValue as tPowerNodeID);
  const currSelectedState = currNode ? currNode.selected : false;

  currNodes.forEach((value) => {
    // eslint-disable-next-line no-param-reassign
    value.selected = false;
  });

  if (currNode) {
    currNode.selected = !currSelectedState;
    currNodes.set(newValue as tPowerNodeID, currNode);
  }

  usePowerRouter.getState().setNodes(currNodes);

  const category = powerNodeToCategory.get(newValue) ?? 'unknown';
  // useBatteryChart.getState().setCategories([category]);
}

class PowerRouter {
  nodeMap: Map<tPowerNodeID, Node> | null;
  archMap: Map<tPowerArchID, Arch> | null;

  constructor() {
    this.nodeMap = null;
    this.archMap = null;
  }

  createMap(mapData: Map<tPowerNodeID, tNode>) {
    const newMap = new Map<tPowerNodeID, Node>();
    // eslint-disable-next-line no-restricted-syntax
    for (const key of mapData.keys()) {
      newMap.set(key, new Node());
    }
    return newMap;
  }

  createArchMap(mapData: Map<tPowerArchID, tArch>) {
    const newMap = new Map<tPowerArchID, Arch>();

    // eslint-disable-next-line no-restricted-syntax
    for (const key of mapData.keys()) {
      newMap.set(key, new Arch());
    }
    return newMap;
  }

  update(newModel: tPowerRouter) {
    const { profile, nodes, arches } = newModel;
    const width = 600;
    const height = 400;

    if (!this.nodeMap) {
      this.nodeMap = this.createMap(newModel.nodes);
    }

    if (!this.archMap) {
      this.archMap = this.createArchMap(newModel.arches);
    }

    const currProfile = profile === 'dark' ? darkProfile : lightProfile;

    const divContainer = d3.select(newModel.container);
    let svgContainer = divContainer.select<SVGSVGElement>('svg.container');
    if (svgContainer.empty()) {
      svgContainer = divContainer.append('svg').classed('container', true);
    }

    svgContainer.attr('width', width).attr('height', height);
    let originPoint = svgContainer.select<SVGGElement>('g.origin');
    if (originPoint.empty()) {
      originPoint = svgContainer.append('g').classed('origin', true);
    }

    originPoint.attr('transform', `translate(${width / 2}, ${height / 2})`);

    this.archMap.forEach((value, key) => {
      const archData = arches.get(key);
      value.update({
        id: archData?.id ?? '',
        coords: archData?.coordinates ?? ([[0, 0]] as [number, number][]),
        flow: archData?.flow ?? 'none',
        parent: originPoint.node(),
        profile: currProfile,
      });
    });

    this.nodeMap.forEach((value, key) => {
      const nodeData = nodes.get(key);
      const isSelected = nodeData ? nodeData.selected : false;

      value.update({
        parent: originPoint.node(),
        id: key,
        coords: nodeData?.coordinates ?? [0, 0],
        labels: nodeData?.labels ?? [],
        icon: {
          iconPath: nodeData?.icon.path ?? '',
          width: nodeData?.icon.width,
          height: nodeData?.icon.height,
        } as tIconModel,
        activity: {
          active: key !== 'inverter' && key !== 'load',
          iconPaths: nodeData?.activity.iconPaths,
        } as tActivityModel,
        onClick: (d) => {
          updateUI(d as tPowerNodeID);
        },
        profile: currProfile,
        selected: isSelected,
      });
    });
  }
}

export { PowerRouter };
