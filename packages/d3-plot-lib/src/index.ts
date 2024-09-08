import { Container } from './container';
import { BarChart } from './plots/bar';
import Polygon from './plots/polygon';
import TextPlot from './plots/text';
import Line from './plots/line';
import Heatmap from './plots/heatmap';
import Scatter from './plots/scatter';
import Markers from './plots/markers';
import { Scaler } from './scaler';
import Legend from './legend';
import AxLine from './plots/axLine';
import Brush from './brush';
import TrackingPolygon from './trackingPolygon';
import Interactor from './plots/interactor';
import IntersectDetector from './intersectDetector';

import ContainerAttrs from './attributes/container';

import AttrsGenerator from './generators/attributeGenerator';

// new class based objects
import { CContainer } from './classbased/Container/Container';
import { CBar } from './classbased/Plots/Bar';
import { CBandLine } from './classbased/Plots/BandLine';
import { CHeatmap } from './classbased/Plots/Heatmap';
import { CMarkers } from './classbased/Plots/Markers';
import { CText } from './classbased/Plots/Text';
import { CLines } from './classbased/Plots/Line';
import { CHistogram } from './classbased/Plots/Histogram';
import { CFillArea } from './classbased/Plots/FillArea';
import { CGroupedBar } from './classbased/Plots/GroupedBar';
import { CStacked } from './classbased/Plots/StackedPlot';
import { CStackedArea } from './classbased/Plots/StackedAreaPlot';
import { CScatter } from './classbased/Plots/Scatter';
import { CBrush } from './classbased/Plots/Brush';
import { CGeneric } from './classbased/Plots/GenericPlot';

import { PlotHistGenerator as CBinGenerator } from './classbased/Plots/PlotHistGenerator';

import { CLegend } from './classbased/Metadata/Legend';

export {
  ContainerAttrs,
  AttrsGenerator,
  BarChart as BarPlot,
  Container,
  Scaler,
  Legend,
  Scatter,
  Markers,
  Line,
  Heatmap,
  Polygon,
  TrackingPolygon,
  TextPlot,
  AxLine,
  Brush,
  Interactor,
  IntersectDetector,
  CContainer,
  CBar,
  CBandLine,
  CHeatmap,
  CMarkers,
  CText,
  CLines,
  CHistogram,
  CBinGenerator,
  CFillArea,
  CGroupedBar,
  CLegend,
  CStacked,
  CStackedArea,
  CScatter,
  CBrush,
  CGeneric,
};
