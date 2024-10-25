import type { ReactNode } from "react"
import React from "react"

import type { Caching } from "@/caching"
import { getCachingContext } from "@/caching/context"
import { getCachedPayload } from "@/caching/getPayload"
import { cacheStillFresh } from "@/caching/stillFresh"
import { updateCachingStore } from "@/caching/updateStore"
import { withRetries } from "@/error_handling/withRetries"
import { Loading } from "@/loading"
import { ReactPerformance } from "@/react_performance"
import type { Validation } from "@/validation"

type Props<Store extends Caching.BaseStore> = {
  children: ReactNode
  buildStore: Caching.Functions.BuildStore<Store>
  loading: Loading.ContextData
}

type State<Store> = {
  loadingConfig: Loading.Config
  store: Store
  processing: string | undefined
  update: boolean
}

export class CachingContainerComponent<
  Store extends Caching.BaseStore,
> extends React.Component<Props<Store>, State<Store>> {
  public state: State<Store> = {
    loadingConfig: {
      dependencies: [],
      processId: `caching`,
    },
    processing: undefined,
    store: this.props.buildStore(),
    update: false,
  }

  public componentDidMount = async () => {
    await this.componentMaybeReady()
  }

  public componentDidUpdate = async () => {
    await this.componentMaybeReady()
  }

  private componentMaybeReady = Loading.curryOnMaybeReady(this, {})

  private buildNameForValidator = (keys: Caching.Keys<Store>): string => {
    return `CachingContainer#cache, keys: ${JSON.stringify(keys)}`
  }

  private cache: Caching.Functions.Cache<Store> = async ({
    attemptSalvage,
    allowSalvage = false,
    caller,
    fetch,
    fetchName,
    keys,
    metadata,
    name = this.buildNameForValidator(keys),
    onValidationFailure,
    refresh,
    validator,
  }) => {
    if (!refresh) {
      const payload = getCachedPayload({
        keys,
        name,
        store: this.state.store,
        validator,
      })

      if (payload && cacheStillFresh(payload)) {
        return payload
      }
    }

    const completion = await withRetries({
      onFatalError: () => {},
      process: fetch,
      processName: `CachingContainer#cache for ${JSON.stringify(keys)}`,
    })

    const validationResult = validator.validate(
      completion.result,
      name,
      attemptSalvage,
    )

    if (validationResult.valid) {
      return this.cacheAndReturn({
        data: validationResult.subject,
        keys,
        metadata,
        name,
        validator,
      })
    }

    await onValidationFailure({
      cacheArgs: {
        attemptSalvage,
        allowSalvage,
        caller,
        fetch,
        fetchName,
        keys,
        name,
        metadata,
        validator,
      },
      result: validationResult,
    })

    if (allowSalvage && validationResult.salvage) {
      return this.cacheAndReturn({
        data: validationResult.salvage,
        keys,
        metadata,
        name,
        validator,
      })
    }
  }

  private cacheAndReturn = async <Data, CacheKeys extends Caching.Keys<Store>>({
    data,
    keys,
    metadata,
    name,
    validator,
  }: {
    data: Data
    keys: CacheKeys
    metadata?: Partial<Caching.Metadata>
    name: string
    validator: Validation.Validator<Data>
  }) => {
    const { store } = await this.updateState((state) => {
      return {
        ...state,
        store: updateCachingStore({
          data,
          keys,
          metadata,
          store: state.store,
        }),
      }
    })

    return getCachedPayload({ keys, name, store, validator })
  }

  public shouldComponentUpdate: ReactPerformance.Functions.ShouldComponentUpdate<
    Props<Store>,
    State<Store>
  > = ReactPerformance.curryShouldUpdateWithManagedState(
    this,
    ({ nextProps, nextState }) => {
      if (Loading.shouldComponentReady(nextProps, nextState)) {
        return { update: true }
      }

      if (this.props.children !== nextProps.children) {
        return { update: true }
      }
    },
  )

  private updateState = ReactPerformance.curryUpdateManagedState(this)

  public render = (): ReactNode => {
    const CachingContext = getCachingContext({
      buildStore: this.props.buildStore,
    })

    return (
      <CachingContext.Provider
        value={{
          cache: this.cache,
          store: this.state.store,
          processing: this.state.processing,
        }}
      >
        {this.props.children}
      </CachingContext.Provider>
    )
  }
}
