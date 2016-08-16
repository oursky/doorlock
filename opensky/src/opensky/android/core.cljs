(ns opensky.android.core
  (:require [reagent.core :as r]))

;(def ble (js/require "react-native-ble-manager"))

(def skygear (js/require "skygear"))
(def skygear-ready? (atom false))
(-> (.config skygear #js{:endPoint "https://chimagun.skygeario.com/"
                         :apiKey "b010cfd737a444be8c12b47c73eebfc0"})
    (.then (fn [_]
             (def OpenDoor (skygear.Record.extend "OpenDoor"))
             (-> (.loginWithUsername skygear "" "")
                 (.then #(reset! skygear-ready? true))))))

(let [rn (js/require "react-native")]
  (def app-registry             (.-AppRegistry rn))
  (def native-app-event-emitter (.-NativeAppEventEmitter rn))
  (def view                     (r/adapt-react-class (.-View rn)))
  (def text                     (r/adapt-react-class (.-Text rn)))
  (def touchable-highlight      (r/adapt-react-class (.-TouchableHighlight rn)))
  )

;(def devices (r/atom {}))
;
;(.addListener native-app-event-emitter
;              "BleManagerDidUpdateState"
;              (fn [_]))
;
;(.addListener native-app-event-emitter
;              "BleManagerDiscoverPeripheral"
;              #(swap! devices assoc (aget % "id") (aget % "name")))

(defn skygear-open-door []
  (when @skygear-ready?
    (-> (.save skygear.publicDB (new OpenDoor))
        (.catch print))))

(defn app-root []
  [view {:style {:flex-direction "column" :margin 40 }}
   [touchable-highlight {:on-press skygear-open-door} [text "Open"]]])

(defn init []
  (.registerComponent app-registry "Opensky" #(r/reactify-component app-root)))
