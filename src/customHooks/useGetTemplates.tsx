import { useCallback, useEffect, useReducer, useRef } from "react";
import { ACTION, STATE, reducer } from "../stateMachines/templatesState";
import { Template } from "../types/Template";

type FetchTemplateProps = {
  abortController?: AbortController;
  baseUrl: string;
};

const getTemplates = async ({
  abortController,
  baseUrl,
}: FetchTemplateProps) => {
  if (abortController?.signal.aborted) {
    return Promise.reject({ message: "Aborted" });
  }

  const response = await fetch(`${baseUrl}/api/templates`, {
    signal: abortController?.signal,
    credentials: "include",
    method: "GET",
  });
  return response;
};

const useGetTemplates = ({ baseUrl }: { baseUrl: string }) => {
  const abortControllerRef = useRef<AbortController | null>(
    new AbortController()
  );

  const [state, send] = useReducer(reducer, {
    state: STATE.IDLE,
    data: { templates: [] },
  });

  const refetch = useCallback(
    () =>
      send({
        type: ACTION.REFETCH,
      }),
    []
  );

  const fetch = useCallback(async () => {
    try {
      abortControllerRef?.current?.abort();
      abortControllerRef.current = new AbortController();
      send({ type: ACTION.FETCH });
      const response = await getTemplates({
        baseUrl,
        abortController: abortControllerRef.current,
      });
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();
      send({
        type: ACTION.SUCCESS,
        data: { templates: data },
      });
    } catch (e) {
      send({
        type: ACTION.FAIL,
        error: e as Error,
      });
    } finally {
      abortControllerRef.current = null;
    }
  }, [baseUrl]);

  useEffect(() => {
    if (state.state === STATE.IDLE) {
      fetch();
    }
  }, [fetch, state]);

  useEffect(
    () => () => {
      abortControllerRef?.current?.abort(
        "Aborting query because the component was unmounted."
      );
    },
    []
  );

  const addTemplate = useCallback((template: Template) => {
    send({
      type: ACTION.ADD_TEMPLATE,
      template,
    });
  }, []);

  const editTemplate = useCallback((template: Template) => {
    send({
      type: ACTION.EDIT_TEMPLATE,
      template,
    });
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    send({
      type: ACTION.DELETE_TEMPLATE,
      templateId,
    });
  }, []);

  return {
    refetch,
    send,
    state,
    addTemplate,
    editTemplate,
    deleteTemplate,
  };
};

export default useGetTemplates;
